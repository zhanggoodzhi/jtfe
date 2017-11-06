package cn.jintongsoft.kb.admin

import com.fasterxml.jackson.annotation.JsonCreator

data class IndividualCreate @JsonCreator constructor(val label: String, val lang: String, val type: String) {
}