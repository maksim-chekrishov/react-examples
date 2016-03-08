import React from 'react'
import { render } from 'react-dom'
import { browserHistory, Router, Route, Link, IndexRoute } from 'react-router'
import auth from './auth'

const App = React.createClass({
    render(){
        return <div className="root">
            {this.props.children}
            </div>
    }
});

const Dashboard = React.createClass({
    render() {
        const token = auth.getToken()

        return (
            <div>
                <Link to="/logout">Log out</Link>
                <h1>Dashboard</h1>
                <p>You made it!</p>
                <p>{token}</p>
                {this.props.children}
            </div>
        )
    }
})

const Login = React.createClass({

    contextTypes: {
        router: React.PropTypes.object.isRequired
    },

    getInitialState() {
        return {
            error: false
        }
    },

    handleSubmit(event) {
        event.preventDefault()

        const email = this.refs.email.value
        const pass = this.refs.pass.value

        auth.login(email, pass, (loggedIn) => {
            if (!loggedIn)
                return this.setState({error: true})

            const { location } = this.props

            if (location.state && location.state.nextPathname) {
                this.context.router.replace(location.state.nextPathname)
            } else {
                this.context.router.replace('/')
            }
        })
    },

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label><input ref="email" placeholder="email" defaultValue="joe@example.com"/></label>
                <label><input ref="pass" placeholder="password"/></label> (hint: password1)<br />
                <button type="submit">login</button>
                {this.state.error && (
                    <p>Bad login information</p>
                )}
            </form>
        )
    }
})

const About = React.createClass({
    render() {
        return <h1>About</h1>
    }
})

const Content = React.createClass({
    render() {
        return <h1>Content 111</h1>
    }
});

const Logout = React.createClass({
    componentDidMount() {
        auth.logout()
    },

    render() {
        return <p>You are now logged out</p>
    }
})

function requireAuth(nextState, replace) {
    if (!auth.loggedIn()) {
        replace({
            pathname: '/login',
            state: {nextPathname: nextState.location.pathname}
        })
    }
}

render((
    <Router history={browserHistory}>
        <Route path="/" component={Dashboard} onEnter={requireAuth}>
            <Route path="/content" component={Content}></Route>
        </Route>
        <Route path="/login" component={Login}/>
        <Route path="/logout" component={Logout}/>
    </Router>
), document.getElementById('example'))