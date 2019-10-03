import {BaseRequestMappingOptions, generateMapping, Mapping} from "./Mapping";
import {HttpMethod} from "../../constant/HttpMethod";


/**
 * DeleteMapping
 */
export const DeleteMapping: Mapping<BaseRequestMappingOptions> = generateMapping<BaseRequestMappingOptions>(HttpMethod.DELETE);
