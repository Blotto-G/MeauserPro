package com.example.meausrepro_android.adapter

import android.view.LayoutInflater
import android.view.ViewGroup
import android.view.animation.AnimationUtils
import androidx.recyclerview.widget.RecyclerView
import com.example.meausrepro_android.R
import com.example.meausrepro_android.databinding.ItemInsBinding
import com.example.meausrepro_app.db.MeausreProInstrument

class InstrumentAdapter():RecyclerView.Adapter<InstrumentAdapter.InstrumentHolder>() {
    var instrumentList = mutableListOf<MeausreProInstrument>()

    interface OnItemClickLister {
        fun onItemClick(pos:Int)
    }
    var onItemClickLister:OnItemClickLister? = null
    inner class InstrumentHolder(val binding:ItemInsBinding):RecyclerView.ViewHolder(binding.root) {
        init {
            itemView.setOnClickListener {
                onItemClickLister?.onItemClick(adapterPosition)
            }
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): InstrumentHolder {
        return InstrumentHolder(ItemInsBinding.inflate(LayoutInflater.from(parent.context), parent, false))
    }

    override fun getItemCount(): Int {
        return instrumentList.size
    }

    override fun onBindViewHolder(holder: InstrumentHolder, position: Int) {
        val instrument = instrumentList[position]

        holder.binding.insNum.text = instrument.insNum
        holder.binding.insName.text = instrument.insName
        holder.binding.insType.text = getInstrumentTypeName(instrument.insType.toString())

        // 애니메이션 적용
        val animation = AnimationUtils.loadAnimation(holder.itemView.context, R.anim.list_item_slide_up)
        holder.itemView.startAnimation(animation)
    }

    // 계측기 타입에 따라 해당 이름 반환
    private fun getInstrumentTypeName(insType: String): String {
        return when (insType) {
            "A" -> "하중계 버팀대"
            "B" -> "하중계 PSBEAM"
            "C" -> "하중계 앵커"
            "D" -> "변형률계"
            "E" -> "구조물 기울기계"
            "F" -> "균열측정계"
            else -> "알 수 없는 계측기"
        }
    }
}