package cn.jintongsoft.kb.admin

import com.fasterxml.jackson.annotation.JsonCreator

data class CandidateType @JsonCreator constructor(val displayName: String, val iri: String) {
}