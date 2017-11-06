package cn.jintongsoft.kb.admin

import com.fasterxml.jackson.annotation.JsonCreator

data class CandidateProp @JsonCreator constructor(val displayName: String, val iri: String) {
	var type: Int = 0
}