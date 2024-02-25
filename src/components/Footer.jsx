import { Component } from 'react'

export default class Footer extends Component {
    render() {
        // eslint-disable-next-line no-undef
        const version = __DAKARA_VERSION__
        // eslint-disable-next-line no-undef
        const bugtracker = __DAKARA_BUGTRACKER__
        // eslint-disable-next-line no-undef
        const projectHomepage = __DAKARA_PROJECT_HOMEPAGE__

        return (
            <footer id="footer" className="box">
                <h2>
                    Dakara client <span className="version">{version}</span>
                </h2>
                <div className="contact">
                    <p className="project">
                        Visit the <a href={projectHomepage}>project page</a>
                    </p>
                    <p className="bug">
                        Report a <a href={bugtracker}>bug</a>
                    </p>
                </div>
            </footer>
        )
    }
}
