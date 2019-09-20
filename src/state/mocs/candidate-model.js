import {statesAb} from '../../assets/data/states'

export default class Candidate {

  constructor(opts) {
    this.level = opts.level;
    this.chamber = opts.chamber;
    this.district = opts.district || null;
    this.party = opts.party;
    this.state = opts.state || null;
    this.stateName = opts.state ? statesAb[this.state] : null;
    this.email = opts.email || null;
    this.in_office = !!opts.incumbent;
    this.role = opts.role || null;
    this.incumbent = opts.incumbent || false;
    this.pledged = !!opts.pledged;
    this.displayName = opts.displayName.replace(/\./g, '');
    this.lastUpdated = opts.lastUpdated || null;
    this.lastUpdatedBy = opts.lastUpdatedBy || null;
  }

  createNameKey() {
    let memberKey;
    let member = this.displayName;
    let nameArray = member.split(' ');
    if (nameArray.length === 0 ) {
      return console.log('only one name', member);
    }
    if (nameArray.length > 2) {
      let firstname = nameArray[0];
      let middlename = nameArray[1];
      let lastname = nameArray[2];
      if (firstname.length === 1 || middlename.length === 1) {
        memberKey = lastname.toLowerCase().replace(/,/g, '') + '_' + firstname.toLowerCase() + '_' + middlename.toLowerCase();
      } else {
        memberKey = middlename.toLowerCase() + lastname.toLowerCase().replace(/,/g, '') + '_' + firstname.toLowerCase();
      }
    } else {
      memberKey = nameArray[1].toLowerCase().replace(/,/g, '') + '_' + nameArray[0].toLowerCase();
    }
    return memberKey;
  }

}
