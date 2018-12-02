import { shallow } from 'enzyme';
import LocationList from '../components/LocationList'
import React, { Component } from 'react';

describe('LocationList', () => {
    describe('has correct elements depending on search', ()=> {
        it('search starting point', () => {
            let addSuggestion = [];
            addSuggestion.push({"Address": "address", "ID": "id"});
            const wrapper = shallow(
                <LocationList currentSearch={-1} addressSuggestions={addSuggestion} />
            )
            expect(wrapper.find("LocationSuggestion")).toHaveLength(0);
            expect(wrapper.find("Component")).toHaveLength(2); // 1 for text 1 for view
        })
        it('search stop', () => {
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
            const wrapper = shallow(
                <LocationList currentSearch={0} results={yelpResult} />//stop
            )
            expect(wrapper.find("LocationSuggestion")).toHaveLength(1);
        })
        it('search destination', () => {
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
            const wrapper = shallow(
                <LocationList currentSearch={-2} results={yelpResult} />//destination
            )
            expect(wrapper.find("LocationSuggestion")).toHaveLength(1);
        })
    })
})