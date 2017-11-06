package cn.jintongsoft.kb.admin

import com.fasterxml.jackson.annotation.JsonCreator

data class CandidateRange @JsonCreator constructor(val displayName: String, val iri: String, val type: Int) {
}
