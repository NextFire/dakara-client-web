import dayjs from 'dayjs'
import PropTypes from 'prop-types'
import { Component } from 'react'
import { connect } from 'react-redux'

import { loadLibraryEntries } from 'actions/library'
import { withSearchParams } from 'components/adapted/ReactRouterDom'
import ListingFetchWrapper from 'components/generics/ListingFetchWrapper'
import Navigator from 'components/generics/Navigator'
import SearchBox from 'components/library/SearchBox'
import SongEntry from 'components/library/song/Entry'
import { songStatePropType } from 'reducers/library'

class SongList extends Component {
    static propTypes = {
        karaokeDateStop: PropTypes.string,
        playlistDateEnd: PropTypes.string.isRequired,
        searchParams: PropTypes.object.isRequired,
        setSearchParams: PropTypes.func.isRequired,
        songState: songStatePropType.isRequired,
    }

    /**
     * Fetch songs from server
     */
    refreshEntries = () => {
        this.props.loadLibraryEntries('songs', {
            page: this.props.searchParams.get('page'),
            query: this.props.searchParams.get('query'),
        })
    }

    componentDidMount() {
        this.refreshEntries()
    }

    componentDidUpdate(prevProps) {
        if (this.props.searchParams !== prevProps.searchParams) {
            this.refreshEntries()
        }
    }

    render() {
        const { songs, count, pagination } = this.props.songState.data
        const { playlistDateEnd, karaokeDateStop } = this.props

        /**
         * Compute remaining karoke time
         */

        let karaokeRemainingSeconds
        if (karaokeDateStop) {
            karaokeRemainingSeconds = dayjs(karaokeDateStop).diff(
                playlistDateEnd,
                'seconds'
            )
        }

        /**
         * Create SongEntry for each song
         */

        const libraryEntrySongList = songs.map(song => (
             <SongEntry
                key={song.id}
                song={song}
                karaokeRemainingSeconds={karaokeRemainingSeconds}
             />
        ))

        return (
            <div id="song-library">
                <SearchBox
                    placeholder="What will you sing?"
                    help={(
                        <>
                            <p>
                                You can obtain better results with the query search
                                mini-language:
                            </p>
                            <ul>
                                <li>
                                    Quotes to group words: {' '}
                                    <span className="example">"my artist"</span>
                            </li>
                                <li>
                                    Prefix and quotes to search in a specific
                                    field: {' '}
                                    <span className="example">artist:"my artist"</span>
                                </li>
                                <li>
                                    Prefix and doubled quotes to search a specific
                                    field exactly: {' '}
                                    <span className="example">
                                        artist:""my artist name""
                                    </span>
                                </li>
                                <li>
                                    Hash tag to target tags: {' '}
                                    <span className="example">#tag</span>
                                </li>
                            </ul>
                        </>
                    )}
                />
                <div className="song-list">
                    <ListingFetchWrapper
                        status={this.props.songState.status}
                    >
                        <ul className="library-list listing">
                            {libraryEntrySongList}
                        </ul>
                    </ListingFetchWrapper>
                    <Navigator
                        count={count}
                        pagination={pagination}
                        names={{
                            singular: 'song found',
                            plural: 'songs found'
                        }}
                    />
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    songState: state.library.song,
    playlistDateEnd: state.playlist.entries.data.date_end,
    karaokeDateStop: state.playlist.digest.data.karaoke.date_stop,
})

SongList = withSearchParams(connect(
    mapStateToProps,
    { loadLibraryEntries }
)(SongList))

export default SongList

/**
 * Get a dict with the following:
 * - placeholder: library search placeholder
 */
export const getSongLibraryNameInfo = () => ({
    placeholder: 'What will you sing?',
})
