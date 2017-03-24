export class XmlHelper {
  composeXml(searchParameters) {
    let xml = '';
    for(let field in searchParameters) {
      if(this.isNullValues(searchParameters[field])) {
        continue;
      }
      if(searchParameters[field] != 'all' && searchParameters != '') {
         xml += `<definitionKey>${this.getDefinitionLibraryKey(field, searchParameters[field])}</definitionKey>`;
      }
      if(Array.isArray(searchParameters[field])) {
        xml += this.composeParameterValues(field, searchParameters[field]);
      }
    }
    return `<org.openmrs.module.reporting.cohort.definition.DefinitionLibraryCohortDefinition>${xml}</org.openmrs.module.reporting.cohort.definition.DefinitionLibraryCohortDefinition>`;
  }

  isNullValues(fieldValues) {
    if(Array.isArray(fieldValues)) {
      return (!fieldValues[0].value) ? true : false;
    }
    return (fieldValues === 'all' || !fieldValues) ? true : false;
  }

  getDefinitionLibraryKey(field, value) {
    let definitionLibraryKey = 'reporting.library.cohortDefinition.builtIn';
    switch(field) {
      case 'gender': definitionLibraryKey += `.${value}`; break;
      default: definitionLibraryKey += `.${field}`;
    }
    return definitionLibraryKey;
  }

  composeParameterValues(definition, definitionParameters) {
    let parameterXml = '<parameterValues>';
    definitionParameters.forEach(eachParam => {
      parameterXml += `<entry><string>${eachParam.name}</string><${eachParam.dataType}>${eachParam.value}</${eachParam.dataType}></entry>`;
    });
    parameterXml += '</parameterValues>';
    return parameterXml;
  }
}
