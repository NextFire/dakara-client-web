import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import WorkEntry from './Entry'
import ListWrapper from '../ListWrapper'
import Navigator from 'components/generics/Navigator'

class WorkList extends Component {
    static propTypes = {
        entries: PropTypes.shape({
            data: PropTypes.shape({
                results: PropTypes.arrayOf(PropTypes.shape({
                    id: PropTypes.any.isRequired,
                }).isRequired).isRequired,
            }),
            isFetching: PropTypes.bool.isRequired,
            fetchError: PropTypes.bool.isRequired,
        }),
        libraryType: PropTypes.string.isRequired,
        workTypes: PropTypes.object.isRequired,
    }

    render() {
        const { entries } = this.props

        if (!entries || !entries.data) {
            return null
        }

        const works = entries.data.results

        const libraryEntryWorkList = works.map(work =>
              <WorkEntry
                key={work.id}
                work={work}
                workType={this.props.libraryType}
              />
        )

        const { isFetching, fetchError } = entries
        const libraryNameInfo = getWorkLibraryNameInfo(
            this.props.libraryType,
            this.props.workTypes
        )

        return (
            <div className="work-list">
                <ListWrapper
                    isFetching={isFetching}
                    fetchError={fetchError}
                >
                    <ul className="library-list listing">
                        {libraryEntryWorkList}
                    </ul>
                </ListWrapper>
                <Navigator
                    data={entries.data}
                    names={{
                        singular: `${libraryNameInfo.singular} found`,
                        plural: `${libraryNameInfo.plural} found`
                    }}
                    location={location}
                />
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => ({
    entries: state.library.work[ownProps.libraryType],
    workTypes: state.library.workTypes
})

WorkList = connect(
    mapStateToProps,
)(WorkList)

export default WorkList

/**
 * Get a dict with the following:
 * - singular: library singular name
 * - plural: library plural name
 * - placeholder: library search placeholder
 */
export const getWorkLibraryNameInfo = (workTypeQueryName, workTypes) => {
    // Find work type matching the query name
    const workType = workTypes.data.results.find(
        (workType) => workType.query_name == workTypeQueryName
    )

    if (!workType) {
        // Fall back if work not found
        return {
            singular: "work",
            plural: "works",
            placeholder: "What are you looking for?",
        }
    }

    return {
        singular: workType.name.toLowerCase(),
        plural: workType.name_plural.toLowerCase(),
        placeholder: `What ${workType.name.toLowerCase()} do you want?`,
    }
}
