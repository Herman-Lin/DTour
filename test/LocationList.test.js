import { shallow } from 'enzyme';
import LocationList from '../components/LocationList'
import React, { Component } from 'react';

describe('LocationList', () => {
    describe('has correct elements depending on search', ()=> {
        let yelpResult = [];
        yelpResult.push(
            {
                "name": "business",
                "image_url": "business.com",
                "is_closed": true,
                "review_count": 102,
                "categories": ["food"],
                "rating": 3.7,
                "coordinates": "coords",
                "price": "$$",
                "location": {display_address: ["display address"]} ,
                }
        );
        it('search starting point', () => {
            const wrapper = shallow(
                <LocationList currentSearch={-1} results={yelpResult} />
            )
            expect(wrapper.find("LocationSuggestion")).toHaveLength(1);
        })
        it('search stop', () => {
            const wrapper = shallow(
                <LocationList currentSearch={0} results={yelpResult} />//stop
            )
            expect(wrapper.find("LocationSuggestion")).toHaveLength(1);
        })
        it('search destination', () => {
            const wrapper = shallow(
                <LocationList currentSearch={-2} results={yelpResult} />//destination
            )
            expect(wrapper.find("LocationSuggestion")).toHaveLength(1);
        })
        it('impossible search', () => {
            const wrapper = shallow(
                <LocationList currentSearch={-3} results={yelpResult} />//not possible
            )
            expect(wrapper.find("LocationSuggestion")).toHaveLength(0);
        })
    })
})