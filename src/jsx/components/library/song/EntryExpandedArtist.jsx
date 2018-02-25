import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class SongEntryExpandedArtist extends Component {
    static propTypes = {
        artist: PropTypes.shape({
            name: PropTypes.string.isRequired,
        }).isRequired,
    }

    handleSearchArtist = () => {
        this.props.setQuery(`artist:""${this.props.artist.name}""`)
    }

    render() {
        const artist = this.props.artist
        return (
                <li className="sublisting-entry">
                    <div className="controls subcontrols">
                        <button className="control primary" onClick={this.handleSearchArtist}>
                            <span className="icon">
                                <i className="fa fa-search"></i>
                            </span>
                        </button>
                    </div>
                    <div className="artist">
                        <div className="name">
                            {artist.name}
                        </div>
                    </div>
                </li>
        )
    }
}
