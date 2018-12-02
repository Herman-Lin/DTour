import { shallow } from 'enzyme';
import AddDeleteStopButton from '../components/AddDeleteStopButton'
import React, { Component } from 'react';

// checks that the functions for the buttons are called correctly
// checks the state of the component to see if they have changed properly 

describe('AddDeleteStopButton', () =>{
    describe('click button', () => {
        it('calls correct functions', () => {
            let onAdd = jest.fn();
            let onDelete = jest.fn();
            const wrapper = shallow(
                <AddDeleteStopButton addStop={onAdd} deleteStop={onDelete} />
            );
            let element = wrapper.find('TouchableOpacity');
            expect(element).toHaveLength(1);
            element.props().onPress();
            expect(onAdd).toHaveBeenCalledTimes(1);
            wrapper.find('TouchableOpacity').props().onPress();
            expect(onDelete).toHaveBeenCalledTimes(1);

        })
        it('changes to the correct state', () => {
            let onAdd = jest.fn();
            let onDelete = jest.fn();
            const wrapper = shallow(
                <AddDeleteStopButton addStop={onAdd} deleteStop={onDelete} />
            );
            let element = wrapper.find('TouchableOpacity');
            expect(element).toHaveLength(1);
            expect(wrapper.state('addDisabled')).toEqual(false);
            expect(wrapper.state('deleteDisabled')).toEqual(true);
            element.props().onPress();
            expect(wrapper.state('addDisabled')).toEqual(true);
            expect(wrapper.state('deleteDisabled')).toEqual(false);
        })
    })
})