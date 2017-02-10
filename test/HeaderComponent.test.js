import React from 'react';
import {mount, shallow} from 'enzyme';
import {expect} from 'chai';
import sinon from 'sinon';
import Header from '../app/js/components/common/Header';


describe('<Header />', () => {

    // it('should mount the BreadCrumbComponent in the dom', () => {
    //     sinon.spy(Header.prototype, 'componentDidMount');
    //     const wrapper = mount(<Header/>);
    //     expect(Header.prototype.componentDidMount.calledOnce).to.equal(true);
    // });

    it('should contain the correct elements', () => {
        const wrapper = shallow(<Header/>);
        console.log(wrapper.render());
        // expect(wrapper.find("a")).to.have.length(1);
        // expect(wrapper.find('.glyphicon')).to.have.length(2);
        // expect(wrapper.find('.title').text()).to.equal('Cohort Builder');
    });

});
