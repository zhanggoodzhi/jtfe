package cn.jintongsoft.kb.admin

import com.fasterxml.jackson.annotation.JsonCreator

data class AppGet @JsonCreator constructor(val id: Int, val name: String) : Comparable<AppGet>  {
    override fun compareTo(other: AppGet): Int {
        return this.id - other.id
    }
}
