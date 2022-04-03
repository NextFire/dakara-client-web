import classNames from "classnames"
import PropTypes from 'prop-types'
import React, { Component } from 'react'

import { withLocation } from "components/generics/Router"

class NotFound extends Component {
    static propTypes = {
        location: PropTypes.object.isRequired,
        embedded: PropTypes.bool,
    }

    render() {
        const url = this.props.location.pathname
        const { embedded } = this.props
        return (
            <div id="error-page" className={classNames("box danger", {embedded})}>
                <div className="header">
                    <h2>Not found</h2>
                </div>
                <div className="content">
                    <div className="url">{url}</div>
                    <p>We're sorry, your request did not match any route…</p>
                </div>
            </div>
        )
    }
}

export default withLocation(NotFound)
