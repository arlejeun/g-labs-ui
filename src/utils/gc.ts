import { getRandomInt } from '@/utils/number';

const _militaryAlphabet = ["Alpha", "Bravo", "Charlie", "Delta", "Echo",
			"Foxtrot", "Golf", "Hotel", "India", "Juliet", "Kilo", "Lima", "Mike", "November", "Oscar", "Papa",
			"Quebec", "Romeo", "Sierra", "Tango", "Uniform", "Victor", "Whiskey", "X-Ray", "Yankee", "Zulu"]

const _medals = ["Platinum", "Gold", "Silver", "Bronze"]

/**
 * Returns GC skill based on military alphabet for segmenting users with gts managed org 
 * @param lastName user last name 
 */
export const getPureCloudSkill1 = (lastName: string) => {
  const index = _militaryAlphabet.findIndex( name => name.substring(0,1) == lastName.substring(0,1).toUpperCase())
  return _militaryAlphabet[index]
}

/**
 * Returns GC skill based on random for segmenting users with gts managed org 
 */
export const getPureCloudSkill2 = () => {
  return _medals[getRandomInt(_medals.length)]
}

export const regionOptions = [{ "label": "APAC", "value": "APAC" }, { "label": "CANADA", "value": "CANADA" }, { "label": "EMEA", "value": "EMEA" }, { "label": "LATAM", "value": "LATAM" }, { "label": "SCO US West", "value": "NA_USW" }, { "label": "SCO - US Central", "value": "NA_USC" }, { "label": "SCO - US East", "value": "NA_USE" }, { "label": "SCO - Velocity", "value": "NA_VELOCITY" }, { "label": "SCO - Architects", "value": "NA_ARCHITECTS" }, { "label": "SCO - Government", "value": "NA_GOVERNMENT" }, { "label": "US East", "value": "USE" }, { "label": "US Central", "value": "USC" }, { "label": "US West", "value": "USW" }]
export const partnerRegionOptions = [{ "label": "APAC Partner", "value": "APAC_Partner" }, { "label": "Canada Partner", "value": "Canada_Partner" }, { "label": "EMEA Partner", "value": "EMEA_Partner" }, { "label": "LATAM Partner", "value": "LATAM_Partner" }, { "label": "US Partner", "value": "US_Partner" }]


export const environments = [
  {
    id: 1,
    name: 'purecloudnow',
  },
  {
    id: 2,
    name: '3rd party org',
  },
];