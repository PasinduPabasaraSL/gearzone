import { Component } from 'react'

/**
 * Catches failures inside a 3D scene (lost GPU context, shader compile
 * errors, failed chunk download) and shows the static fallback instead, so a
 * WebGL problem never breaks the surrounding page.
 */
export default class SceneErrorBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error) {
    console.warn('3D scene disabled, showing fallback:', error?.message ?? error)
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}
