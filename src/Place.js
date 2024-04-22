import React, { Component, PureComponent } from 'react'

export default class Place extends PureComponent {
    render() {
        return this.props.list.map(p => {
            return (
                <div className='place' id={p} key={p}></div>
            )
        })
    }
}
