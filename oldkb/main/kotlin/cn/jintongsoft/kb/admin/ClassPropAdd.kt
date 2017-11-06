package cn.jintongsoft.kb.admin

import com.fasterxml.jackson.annotation.JsonCreator

data class ClassPropAdd @JsonCreator constructor(val type: Int, val iri: String, val value: String, val lang: String?) {
}
