export class JSONHelper {
  composeJson(searchParameters) {
    const query = {};
    let counter = 0;
    for(let field in searchParameters) {
      if(this.isNullValues(searchParameters[field])) {
        continue;
      }
      if(searchParameters[field] != 'all' && searchParameters != '') {
        counter += 1;
        query[counter] = {};
        query[counter].libraryKey = this.getDefinitionLibraryKey(field, searchParameters[field]);
      }
      if(Array.isArray(searchParameters[field])) {
        query[counter].parameter = this.getParameterValues(searchParameters[field]);
      }
    }
    return (counter === 1) ? this.singleDefinition(query) : this.composition(query, counter);
  }

  isNullValues(fieldValues) {
    if(Array.isArray(fieldValues)) {
      return (!fieldValues[0].value) ? true : false;
    }
    return (fieldValues === 'all' || !fieldValues) ? true : false;
  }

  singleDefinition(searchQuery) {
    return searchQuery['1'];
  }

  getDefinitionLibraryKey(field, value) {
    let definitionLibraryKey = 'reporting.library.cohortDefinition.builtIn';
    switch (field) {
      case 'gender':
        definitionLibraryKey += `.${value}`;
        break;
      default:
        definitionLibraryKey += `.${field}`;
    }
    return definitionLibraryKey;
  }

  getParameterValues(parameterFields) {
    const parameter = {};
    parameterFields.forEach(eachParam => {
      parameter[eachParam.name] = eachParam.value;
    });
    return parameter;
  }

  composition(searchQuery, totalNumber) {
    searchQuery.rowFilters = [];
    let compositionTitle = '1';
    for (let index = 2; index <= totalNumber; index++) {
      compositionTitle += ' AND '+index;
    }
    searchQuery.customRowFilterCombination = compositionTitle;
    return searchQuery;
  }
}

/*{
  "type": "org.openmrs.module.reporting.dataset.definition.PatientDataSetDefinition",
  "customRowFilterCombination": "1 AND 2",
  "rowFilters": [
    {
      "type": "org.openmrs.module.reporting.cohort.definition.CohortDefinition",
      "key": "reporting.library.cohortDefinition.builtIn.females"
    },
    {
      "type": "org.openmrs.module.reporting.cohort.definition.CohortDefinition",
      "key": "reporting.library.cohortDefinition.builtIn.ageRangeOnDate",
      "parameterValues": {
        "minAge": 50,
        "maxAge": 60
      }
    }
  ]
}

Object
1
:
Object
libraryKey
:
"reporting.library.cohortDefinition.builtIn.males"
__proto__
:
Object
2
:
Object
libraryKey
:
"reporting.library.cohortDefinition.builtIn.ageRangeOnDate"
parameter
:
Object
maxAge
:
"30"
minAge
:
"20"
__proto__
:
Object
__proto__
:
Object
composition
:
"1 AND 2"
__proto__
:
Object
*/