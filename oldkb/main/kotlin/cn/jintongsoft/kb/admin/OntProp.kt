package cn.jintongsoft.kb.admin

import com.fasterxml.jackson.annotation.JsonCreator

data class OntProp @JsonCreator constructor(val displayName: String, val iri: String, val hasSub: Boolean) {
}
