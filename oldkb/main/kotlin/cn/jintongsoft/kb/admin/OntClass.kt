package cn.jintongsoft.kb.admin

import com.fasterxml.jackson.annotation.JsonCreator

data class OntClass @JsonCreator constructor(val displayName: String, val iri: String, val hasSub: Boolean) {
}
