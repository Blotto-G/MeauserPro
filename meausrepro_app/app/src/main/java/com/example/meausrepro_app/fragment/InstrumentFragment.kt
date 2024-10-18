package com.example.meausrepro_app.fragment

import android.os.Bundle
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import androidx.appcompat.app.AlertDialog
import androidx.core.view.isGone
import androidx.core.view.isVisible
import com.example.meausrepro_android.R
import com.example.meausrepro_android.databinding.FragmentInstrumentBinding
import com.example.meausrepro_app.db.MeausreProClient
import com.example.meausrepro_app.db.MeausreProInstrument
import com.example.meausrepro_app.db.MeausreProManType
import com.example.meausrepro_app.db.MeausreProManagement
import com.example.meausrepro_app.db.dto.ManagementDTO
import retrofit2.Call
import retrofit2.Response
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class InstrumentFragment : Fragment() {
    // TODO: Rename and change types of parameters
    lateinit var binding:FragmentInstrumentBinding

    private var instrIdx: Int? = null
    private var id: String? = null

    lateinit var instrument: MeausreProInstrument
    // 타입과 계측기 이름을 매핑한 HashMap
    val instrumentTypeMap = HashMap<String, String>().apply {
        put("A", "하중계 버팀대")
        put("B", "하중계 PSBEAM")
        put("C", "하중계 앵커")
        put("D", "변형률계")
        put("E", "구조물 기울기계")
        put("F", "균열측정계")
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        arguments?.let {
            instrIdx = it.getInt("instrIdx")
            id = it.getString("id")
        }
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        binding = FragmentInstrumentBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        // 계측기 정보 가져오기
        getInstrInfo(instrIdx!!)

        // 현재 날짜 가져 오기
        val currentDate = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(Date())
        binding.edtCreateDate.setText(currentDate)

        // 저장 버튼
        binding.btnSave.setOnClickListener {
            if (validateFields(instrument.insType.toString())) {
                val createDate = binding.edtCreateDate.text.toString()
                // 비어있다면 null 반환
                val comment = binding.edtComment.text?.toString()?.takeIf { it.isNotBlank() }
                var management = MeausreProManagement(null, instrument, instrument.insType, createDate, comment)

                val gage1 = binding.edtGage1.text?.toString()?.takeIf { it.isNotBlank() }?.toDoubleOrNull()
                val gage2 = binding.edtGage2.text?.toString()?.takeIf { it.isNotBlank() }?.toDoubleOrNull()
                val gage3 = binding.edtGage3.text?.toString()?.takeIf { it.isNotBlank() }?.toDoubleOrNull()
                val gage4 = binding.edtGage4.text?.toString()?.takeIf { it.isNotBlank() }?.toDoubleOrNull()
                val crackWidth = binding.edtCrackWidth.text?.toString()?.takeIf { it.isNotBlank() }?.toDoubleOrNull()

                val manageType = MeausreProManType(null, null, gage1, gage2, gage3, gage4, crackWidth)

                val manDTO = ManagementDTO(management, manageType)

                MeausreProClient.retrofit.saveManagement(manDTO, instrIdx!!).enqueue(object:retrofit2.Callback<MeausreProManType>{
                    override fun onResponse(
                        call: Call<MeausreProManType>,
                        response: Response<MeausreProManType>
                    ) {
                        if (response.isSuccessful) {
                            showCustomDialog("저장되었습니다.", "save")
                        }
                        else {
                            Log.d("MeausreProLog man", response.code().toString())
                        }
                    }

                    override fun onFailure(call: Call<MeausreProManType>, t: Throwable) {
                        Log.d("MeausreProLog man", t.toString())
                    }

                })
            }
            else {
                showCustomDialog("필수 입력 필드를 입력해주세요.", "formCheck")
            }
        }

        // 뒤로가기
        binding.btnBack.setOnClickListener {
            requireActivity().onBackPressed()
        }

        // 리셋 버튼
        binding.btnReset.setOnClickListener {
            binding.edtGage1.setText(null)
            binding.edtGage2.setText(null)
            binding.edtGage3.setText(null)
            binding.edtGage4.setText(null)
            binding.edtComment.setText(null)
            binding.edtCrackWidth.setText(null)
        }
    }

    companion object {
        @JvmStatic
        fun newInstance(instrIdx:Int, id:String) =
            InstrumentFragment().apply {
                arguments = Bundle().apply {
                    putString("id", id)
                    putInt("instrIdx", instrIdx)
                }
            }
    }

    // 계측기 정보 가져오기
    private fun getInstrInfo(instrIdx: Int) {
        MeausreProClient.retrofit.getInstrumentInfo(instrIdx).enqueue(object:retrofit2.Callback<MeausreProInstrument>{
            override fun onResponse(
                call: Call<MeausreProInstrument>,
                response: Response<MeausreProInstrument>
            ) {
                if (response.isSuccessful && response.body() != null) {
                    instrument = response.body()!!
                    binding.insName.text = "${instrumentTypeMap[instrument.insType.toString()]} ${instrument.insNum}"

                    instrTypeForm(instrument.insType.toString())
                } else {
                    Log.d("MeausreProLog Ins", response.code().toString())
                }
            }

            override fun onFailure(call: Call<MeausreProInstrument>, t: Throwable) {
                Log.d("MeausreProLog Ins", t.toString())
            }

        })
    }

    // 계측기 타입별 컬럼 정리
    private fun instrTypeForm(type:String) {
        if (type.equals("A") || type.equals("B") || type.equals("C") || type.equals("E")) {
            binding.gage2Secgtion.isVisible = true
            binding.gage3Secgtion.isVisible = true
            binding.crackWidthSecgtion.isGone = true

            if (type.equals("E")) {
                binding.gage1Text.text = "측정값1"
                binding.gage2Text.text = "측정값2"
                binding.gage3Text.text = "측정값3"
                binding.gage4Secgtion.isVisible = true
            } else {
                binding.gage1Text.text = "측정치1"
                binding.gage2Text.text = "측정치2"
                binding.gage3Text.text = "측정치3"
                binding.gage4Secgtion.isGone = true
            }
        } else {
            binding.gage2Secgtion.isGone = true
            binding.gage3Secgtion.isGone = true
            binding.gage4Secgtion.isGone = true

            binding.gage1Text.text = "측정치"
            if (type.equals("F")) {
                binding.crackWidthSecgtion.isVisible = true
            } else {
                binding.crackWidthSecgtion.isGone = true
            }
        }
    }

    // 타입별 필드 검증 함수
    private fun validateFields(type: String): Boolean {
        var isValid = true

        // 공통 필드 검증: edtGage1
        if (binding.edtGage1.text.isNullOrBlank()) {
            isValid = false
        }
        // A, B, C, E 타입은 edtGage2, edtGage3 필수
        if (type == "A" || type == "B" || type == "C" || type == "E") {
            if (binding.edtGage2.text.isNullOrBlank()) {
                isValid = false
            }
            if (binding.edtGage3.text.isNullOrBlank()) {
                isValid = false
            }
        }
        // E 타입은 edtGage4 필수
        if (type == "E") {
            if (binding.edtGage4.text.isNullOrBlank()) {
                isValid = false
            }
        }
        // F 타입은 edtCrackWidth 필수
        if (type == "F") {
            if (binding.edtCrackWidth.text.isNullOrBlank()) {
                isValid = false
            }
        }

        return isValid
    }

    // 커스텀 다이얼로그
    private fun showCustomDialog(message: String, stats:String) {
        val dialogView = LayoutInflater.from(binding.root.context).inflate(R.layout.dialog_confirm, null)
        val builder = AlertDialog.Builder(binding.root.context)
        builder.setView(dialogView)

        val dialog = builder.create()

        val confirmTextView = dialogView.findViewById<TextView>(R.id.confirmTextView)
        confirmTextView.text = message  // 메시지 설정

        val btnCancel = dialogView.findViewById<Button>(R.id.btnCancel)
        btnCancel.isGone = true

        val btnConfirm = dialogView.findViewById<Button>(R.id.btnConfirm)
        btnConfirm.setOnClickListener {
            if (stats.equals("save")) {
                // 정보가 저장 됐다면 이전으로
                requireActivity().onBackPressed()
                dialog.dismiss()
            } else {
                dialog.dismiss()
            }
        }

        dialog.show()
    }
}