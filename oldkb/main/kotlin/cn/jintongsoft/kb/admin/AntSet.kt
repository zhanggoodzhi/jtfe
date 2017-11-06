package cn.jintongsoft.kb.admin

import com.fasterxml.jackson.annotation.JsonCreator

data class AntSet @JsonCreator constructor(val iri: String, val key: String, val value: String, val lang: String?) {
}