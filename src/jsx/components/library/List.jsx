import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'
import { connect } from 'react-redux'
import { parse } from 'query-string'
import Library from './Library'
import NotFound from 'components/navigation/NotFound'
import SongList, { getSongLibraryNameInfo } from './song/List'
import ArtistList, { getArtistLibraryNameInfo } from './artist/List'
import WorkList, { getWorkLibraryNameInfo } from './work/List'
import { loadLibraryEntries } from 'actions'

class List extends Component {
    componentDidMount() {
        this.refreshEntries()
    }

    componentDidUpdate(prevProps) {
        const query = parse(this.props.location.search)
        const prevQuery = parse(prevProps.location.search)
        // since there is only one `LibraryListWork` component, it is not unmounted
        // when navigating through work types, so we have to watch when the
        // component is updated wether we have jumped to another work type
        if (this.props.match.params.libraryType != prevProps.match.params.libraryType ||
            this.props.workTypes.hasFetched != prevProps.workTypes.hasFetched ||
            query.page != prevQuery.page ||
            query.search != prevQuery.search) {
            this.refreshEntries()
        }
    }

    checkWorkTypesHasFetched = () => {
        return this.props.workTypes.hasFetched
    }

    /**
     * Check library type exists: 'song' or 'artist' or contained in worktypes
     */
    checkLibraryTypeExists = () => {
        const { workTypes } = this.props
        const { libraryType } = this.props.match.params

        if (['song', 'artist'].includes(libraryType)) {
            return true
        }

        const workTypeMatched = workTypes.data.results.find(
            (workTypeObject) => workTypeObject.query_name == libraryType
        )

        return !!workTypeMatched
    }

    refreshEntries = () => {
        const libraryType = this.props.match.params.libraryType
        const queryObj = parse(this.props.location.search)
        const { page: pageNumber, search: query } = queryObj

        if (!this.checkWorkTypesHasFetched() || !this.checkLibraryTypeExists()) {
            return
        }

        let args = {}

        if (pageNumber) {
            args.pageNumber = pageNumber
        }

        if (query) {
            args.query = query
        }

        this.props.loadLibraryEntries(libraryType, args)
    }

    render() {
        const { workTypes, location } = this.props
        const { libraryType } = this.props.match.params

        if (!this.checkWorkTypesHasFetched()) {
            return null
        }

        if (!this.checkLibraryTypeExists()) {
            return (
                <NotFound location={location}/>
            )
        }

        let ListComponent
        let getLibraryNameInfo
        switch (libraryType) {
            case "song":
                ListComponent = SongList
                getLibraryNameInfo = getSongLibraryNameInfo
                break

            case "artist":
                ListComponent = ArtistList
                getLibraryNameInfo = getArtistLibraryNameInfo
                break

            default:
                ListComponent = WorkList
                getLibraryNameInfo = getWorkLibraryNameInfo
                break
        }

        const libraryNameInfo = getLibraryNameInfo(libraryType, workTypes)

        return (
            <Library
                location={this.props.location}
                match={this.props.match}
                nameInfo={libraryNameInfo}
                workTypes={workTypes}
            >
                <ListComponent
                    libraryType={libraryType}
                    location={location}
                />
            </Library>
        )
    }
}

const mapStateToProps = (state) => ({
    workTypes: state.library.workTypes,
})

List = connect(
    mapStateToProps,
    { loadLibraryEntries }
)(List)

export default List
