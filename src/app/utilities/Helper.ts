
/**
 * The helper utilities class
 */
export class Helper {

  /**
   * Delete properties with null and empty values
   * @param queryParams
   */
  static deleteUnusedProperties(queryParams: any) {
    for (const property in queryParams.params) {
      if (!queryParams.params[property] && queryParams.params[property] !== 0) {
        delete queryParams.params[property];
      }
    }
    return queryParams;
  }

}
