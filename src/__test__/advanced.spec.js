import React from 'react'
import PropTypes from 'prop-types'
import enzyme, { shallow, mount, render } from 'enzyme'
import Adapter from 'enzyme-adapter-react-15';
import { expect } from 'chai'
import {
  BreadcrumbsProvider,
  Breadcrumbs,
  Dummy as Item,
  withBreadcrumbsItem,
  breadcrumbsThroughArea as throughArea,
} from '../index'

import spec from './index.spec-set'


enzyme.configure({ adapter: new Adapter() });
jest.dontMock('../index')


@withBreadcrumbsItem
class WithBreadcrubmsItems extends React.Component {
  static propTypes = {
    [throughArea]: PropTypes.object,
    haveProfile: PropTypes.bool,
    profileUrl: PropTypes.string,
    reactComponentInProps: PropTypes.bool,
  }

  componentWillMount() {
    this.configureBreadcrumbs(this.props)
  }

  componentWillReceiveProps(nextProps) {
    const keys = Object.keys(nextProps).concat(Object.keys(this.props))
    const skip = [throughArea]
    const differences = keys.filter(
      k => (!skip.includes(k) && this.props[k] !== nextProps[k])
    ).length
    if( differences ) {
      this.configureBreadcrumbs(nextProps)
    }
  }

  configureBreadcrumbs = (props) => {
    if(props.noAnyItem) {
      props[throughArea].item(null)
    } else if(props.onlyOneItem) {
      props[throughArea].item(
        <Item to='/'>Home</Item>
      )
    } else {
      const HomeText = props.replaceAnotherSame ? 'Home Another' : 'Home'
      const Home = props.reactComponentInProps ? <b>Home Bold</b> : HomeText
      props[throughArea].items(
        <div>
          <Item to='/'>{Home}</Item>
          <Item to='/user'>User</Item>
          { props.haveProfile
            ? <Item to={props.profileUrl}>Profile</Item>
            : null
          }
        </div>
      )
    }
  }

  render() {
    return null
  }
}


class TestAdvancedAppComponent extends React.Component {
  static propTypes = {
    [throughArea]: PropTypes.object,
    method: PropTypes.string,
    separator: PropTypes.node,
    renameProps: PropTypes.object,
    duplicateProps: PropTypes.object,
    onlyOneItem: PropTypes.bool,
    noAnyItem: PropTypes.bool,
    reactComponentInProps: PropTypes.bool,
  }

  state = {
    profileUrl: "/user/profile",
    haveProfile: true,
    replaceAnotherSame: false,
  }

  changeProfileUrl = () => {
    this.setState({profileUrl: "/user/settings"})
  }

  restoreProfileUrl = () => {
    this.setState({profileUrl: "/user/profile"})
  }

  removeProfile = () => {
    this.setState({haveProfile: false})
  }

  replaceAnotherSame = () => {
    this.setState({replaceAnotherSame: true})
  }

  render() {
    return (
      <div>
        <Breadcrumbs
          separator={this.props.separator}
          container={this.props.container}
          containerProps={this.props.containerProps}
          renameProps={this.props.renameProps}
          duplicateProps={this.props.duplicateProps} />
        { this.state.replaceAnotherSame
          ? <div> <WithBreadcrubmsItems {...this.props} {...this.state}/> </div>
          : <div> <WithBreadcrubmsItems {...this.props} {...this.state}/> </div>
        }
        <button className="changeProfileUrl" onClick={this["changeProfileUrl"]} />
        <button className="restoreProfileUrl" onClick={this["restoreProfileUrl"]} />
        <button className="removeProfile" onClick={this["removeProfile"]} />
        <button className="replaceAnotherSame" onClick={this["replaceAnotherSame"]} />
      </div>
    )
  }
}

const TestAdvancedApp = (props) => (
  <BreadcrumbsProvider
    shouldBreadcrumbsUpdate={props.shouldBreadcrumbsUpdate}
  >
    <TestAdvancedAppComponent {...props}/>
  </BreadcrumbsProvider>
)

TestAdvancedApp.propTypes = {
  shouldBreadcrumbsUpdate: PropTypes.func,
}



spec(TestAdvancedApp, true)

