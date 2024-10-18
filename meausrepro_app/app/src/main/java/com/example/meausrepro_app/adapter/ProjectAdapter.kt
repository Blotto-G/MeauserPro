package com.example.meausrepro_android.adapter

import android.view.LayoutInflater
import android.view.ViewGroup
import android.view.animation.AnimationUtils
import androidx.recyclerview.widget.RecyclerView
import com.example.meausrepro_android.R
import com.example.meausrepro_android.databinding.ItemProjectBinding
import com.example.meausrepro_app.db.MeausreProProject

class ProjectAdapter():RecyclerView.Adapter<ProjectAdapter.ProjectHolder>() {
    var projectList = mutableListOf<MeausreProProject>()

    interface OnItemClickLister {
        fun onItemClick(pos:Int)
    }
    var onItemClickLister:OnItemClickLister? = null
    inner class ProjectHolder(val binding:ItemProjectBinding):RecyclerView.ViewHolder(binding.root) {
        init {
            itemView.setOnClickListener {
                onItemClickLister?.onItemClick(adapterPosition)
            }
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ProjectHolder {
        return ProjectHolder(ItemProjectBinding.inflate(LayoutInflater.from(parent.context), parent, false))
    }

    override fun getItemCount(): Int {
        return projectList.size
    }

    override fun onBindViewHolder(holder: ProjectHolder, position: Int) {
        val project = projectList[position]

        // 프로젝트 이름
        holder.binding.projectTitle.text = project.siteName

        // 프로젝트 기간
        holder.binding.projectDate.text = "${project.startDate} - ${project.endDate}"

        // 애니메이션 적용
        val animation = AnimationUtils.loadAnimation(holder.itemView.context, R.anim.list_item_slide_up)
        holder.itemView.startAnimation(animation)
    }
}