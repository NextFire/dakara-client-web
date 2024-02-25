import { Component } from 'react'
import semver from 'semver'


export default class DevWarning extends Component {
    render() {
        // eslint-disable-next-line no-undef
        const version = semver.parse(__DAKARA_VERSION__)

        if (version.prerelease.length > 0) {
            console.warn('You are running a dev version, use it at your own risks!')
            return (
                <div id="dev-warning"></div>
            )
        }

        return null
    }
}
