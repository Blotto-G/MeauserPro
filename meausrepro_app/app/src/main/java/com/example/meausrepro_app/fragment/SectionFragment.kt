package com.example.meausrepro_app.fragment

import android.os.Bundle
import android.util.Log
import android.util.TypedValue
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.AdapterView
import android.widget.ArrayAdapter
import android.widget.Spinner
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.meausrepro_android.R
import com.example.meausrepro_android.adapter.InstrumentAdapter
import com.example.meausrepro_android.databinding.FragmentSectionBinding
import com.example.meausrepro_app.db.MeausreProClient
import com.example.meausrepro_app.db.MeausreProInstrument
import com.example.meausrepro_app.db.MeausreProSection
import retrofit2.Call
import retrofit2.Response

class SectionFragment : Fragment() {
    // TODO: Rename and change types of parameters
    private var id: String? = null
    private var project: Int? = null

    lateinit var binding:FragmentSectionBinding
    lateinit var instrumentAdapter: InstrumentAdapter

    // selectBox
    private lateinit var selectBox: Spinner

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        arguments?.let {
            id = it.getString("id")
            project = it.getInt("project")
        }
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        binding = FragmentSectionBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        // ins recyclerview 연결
        instrumentAdapter = InstrumentAdapter()
        binding.insList.adapter = instrumentAdapter
        binding.insList.layoutManager = LinearLayoutManager(binding.root.context)

        // ins 클릭 이벤트
        instrumentAdapter.onItemClickLister = object :InstrumentAdapter.OnItemClickLister {
            override fun onItemClick(pos: Int) {
                val selectInstrument = instrumentAdapter.instrumentList[pos]

                val insFragment = InstrumentFragment.newInstance(selectInstrument.idx!!, id.toString())
                val fragmentManager = requireActivity().supportFragmentManager
                val fragmentTransaction = fragmentManager.beginTransaction()

                fragmentTransaction.replace(R.id.mainContainer, insFragment)
                fragmentTransaction.addToBackStack(null)
                fragmentTransaction.commit()
            }

        }

        // spinner 연결
        selectBox = binding.selectBox
        fetchSelectBoxData()
        binding.selectBox.dropDownVerticalOffset = dipToPixels(45f).toInt()

        // 뒤로가기
        binding.btnBack.setOnClickListener {
            requireActivity().onBackPressed()
        }

        // 새로고침
        binding.btnReset.setOnClickListener {
            fetchSelectBoxData()
        }
    }

    companion object {
        @JvmStatic
        fun newInstance(id:String, project:Int) =
            SectionFragment().apply {
                arguments = Bundle().apply {
                    putString("id", id)
                    putInt("project", project)
                }
            }
    }
    private fun fetchSelectBoxData() {
        MeausreProClient.retrofit.getSection(project!!).enqueue(object:retrofit2.Callback<List<MeausreProSection>> {
            override fun onResponse(
                call: Call<List<MeausreProSection>>,
                response: Response<List<MeausreProSection>>
            ) {
                if (response.isSuccessful) {
                    val selectBoxItems = response.body() ?: emptyList()
                    setupSelectBox(selectBoxItems)
                }
                else {
                    Log.d("MeausreProLog select", response.code().toString())
                }
            }

            override fun onFailure(call: Call<List<MeausreProSection>>, t: Throwable) {
                Log.d("MeausreProLog selectF", t.toString())
            }
        })
    }
    // select box 에 값 넣기
    private fun setupSelectBox(items: List<MeausreProSection>) {
        var idx:Int? = null
        val selectList = if (items.isNotEmpty()) {
            items.map { it.sectionName }
        }
        else {
            listOf("구간 데이터가 존재하지 않습니다.")
        }
        val selectAdapter = ArrayAdapter(requireContext(), android.R.layout.simple_spinner_item, selectList)

        selectAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)

        // spinner adapter 설정
        binding.selectBox.adapter = selectAdapter

        // Spinner item 선택 리스너
        binding.selectBox.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
            override fun onItemSelected(parent: AdapterView<*>, view: View, position: Int, id: Long) {
                if (items.isNotEmpty()) {
                    idx = items[position].idx // 선택된 section의 idx를 저장
                    allInstrumentList(idx!!)
                }
            }

            override fun onNothingSelected(parent: AdapterView<*>) {
                idx = null
            }
        }
        // 초기 상태에서 계측기 목록 가져오기 (첫 번째 항목이 선택되어 있다고 가정)
        if (items.isNotEmpty()) {
            idx = items[0].idx
            allInstrumentList(idx!!)
        }
    }

    // ins list
    private fun allInstrumentList(idx:Int) {
        MeausreProClient.retrofit.getInstrument(idx).enqueue(object:retrofit2.Callback<List<MeausreProInstrument>>{
            override fun onResponse(
                call: Call<List<MeausreProInstrument>>,
                response: Response<List<MeausreProInstrument>>
            ) {
                if (response.isSuccessful) {
                    val instrumentList = response.body() ?: mutableListOf()
                    instrumentAdapter.instrumentList.clear()
                    instrumentAdapter.instrumentList.addAll(instrumentList)
                    instrumentAdapter.notifyDataSetChanged()
                }
                else {
                    Log.d("MeausreProLog Ins", response.code().toString())
                }
            }

            override fun onFailure(call: Call<List<MeausreProInstrument>>, t: Throwable) {
                Log.d("MeausreProLog InsF", t.toString())
            }

        })
    }

    // dp값 px 변환
    private fun dipToPixels(dipValue:Float):Float {
        return TypedValue.applyDimension(
            TypedValue.COMPLEX_UNIT_DIP,
            dipValue,
            resources.displayMetrics
        )
    }
}