package com.example.meausrepro_app.fragment

import android.content.Intent
import android.os.Bundle
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import androidx.appcompat.app.AlertDialog
import androidx.recyclerview.widget.LinearLayoutManager
import com.example.meausrepro_app.MainActivity
import com.example.meausrepro_android.R
import com.example.meausrepro_android.adapter.ProjectAdapter
import com.example.meausrepro_android.databinding.FragmentHomeBinding
import com.example.meausrepro_app.db.MeausreProClient
import com.example.meausrepro_app.db.MeausreProProject
import retrofit2.Call
import retrofit2.Response

class HomeFragment : Fragment() {
    private var id: String? = null
    lateinit var binding: FragmentHomeBinding
    lateinit var projectAdapter: ProjectAdapter
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        arguments?.let {
            id = it.getString("id")
        }
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        binding = FragmentHomeBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        projectAdapter = ProjectAdapter()
        binding.projectList.adapter = projectAdapter
        binding.projectList.layoutManager = LinearLayoutManager(binding.root.context)

        // project 클릭 이벤트
        projectAdapter.onItemClickLister = object:ProjectAdapter.OnItemClickLister{
            override fun onItemClick(pos: Int) {
                val selectProject = projectAdapter.projectList[pos]

                val sectionFragment =
                    SectionFragment.newInstance(id.toString(), selectProject.idx!!)
                val fragmentManager = requireActivity().supportFragmentManager
                val fragmentTransaction = fragmentManager.beginTransaction()

                fragmentTransaction.replace(R.id.mainContainer, sectionFragment)
                fragmentTransaction.addToBackStack(null)
                fragmentTransaction.commit()
            }
        }

        // 로그아웃
        binding.btnLogout.setOnClickListener {
            showCustomDialog("로그아웃 하시겠습니까?")
        }

        // 새로고침 버튼
        binding.btnReset.setOnClickListener {
            allProjectList(id!!)
        }

        allProjectList(id!!);
    }

    companion object {

        @JvmStatic
        fun newInstance(id:String) =
            HomeFragment().apply {
                arguments = Bundle().apply {
                    putString("id", id)
                }
            }
    }
    // 프로젝트 리스트 불러오기
    private fun allProjectList(id:String) {
        MeausreProClient.retrofit.getProject(id).enqueue(object :retrofit2.Callback<List<MeausreProProject>>{
            override fun onResponse(
                call: Call<List<MeausreProProject>>,
                response: Response<List<MeausreProProject>>
            ) {
                if (response.isSuccessful) {
                    val projectList = response.body() ?: mutableListOf()
                    projectAdapter.projectList.clear()
                    projectAdapter.projectList.addAll(projectList)
                    projectAdapter.notifyDataSetChanged()
                } else {
                    Log.d("MeausreProLog pro", response.code().toString())
                }
            }

            override fun onFailure(call: Call<List<MeausreProProject>>, t: Throwable) {
                Log.d("MeausreProLog proF", t.toString())
            }

        })
    }

    // 커스텀 다이얼로그
    private fun showCustomDialog(message: String) {
        val dialogView = LayoutInflater.from(binding.root.context).inflate(R.layout.dialog_confirm, null)
        val builder = AlertDialog.Builder(binding.root.context)
        builder.setView(dialogView)

        val dialog = builder.create()

        val confirmTextView = dialogView.findViewById<TextView>(R.id.confirmTextView)
        confirmTextView.text = message  // 메시지 설정

        val btnCancel = dialogView.findViewById<Button>(R.id.btnCancel)
        val btnConfirm = dialogView.findViewById<Button>(R.id.btnConfirm)

        btnCancel.setOnClickListener {
            dialog.dismiss() // 취소 버튼 클릭 시 다이얼로그 닫기
        }

        btnConfirm.setOnClickListener {
            // 로그아웃 처리 (MainActivity로 이동)
            val intent = Intent(binding.root.context, MainActivity::class.java)
            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            startActivity(intent)
            dialog.dismiss() // 다이얼로그 닫기
        }

        dialog.show()
    }
}