package com.example.meausrepro_app

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.widget.Button
import android.widget.TextView
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.bumptech.glide.Glide
import com.example.meausrepro_android.R
import com.example.meausrepro_android.databinding.ActivityMainBinding
import com.example.meausrepro_app.db.MeausreProClient
import com.example.meausrepro_app.db.MeausreProUser
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response


class MainActivity : AppCompatActivity() {
    lateinit var binding: ActivityMainBinding
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        val imageUrl = getString(R.string.background_image)
        Glide.with(this)
            .load(imageUrl)
            .into(binding.backgroundImageView)

        // 로그인 버튼
        binding.btnLogin.setOnClickListener {
            val id = binding.edtId.text.toString()
            val pw = binding.edtPass.text.toString()

            val loginUser = MeausreProUser(null, id, pw, null, null, null, null, null)

            MeausreProClient.retrofit.login(loginUser).enqueue(object : Callback<MeausreProUser> {
                override fun onResponse(
                    call: Call<MeausreProUser>,
                    response: Response<MeausreProUser>
                ) {
                    if (response.isSuccessful) {
                        val intent = Intent(this@MainActivity, MainActivity_MeausrePro::class.java)
                        intent.putExtra("id", id)
                        startActivity(intent)
                    }
                    else {
                        // 커스텀 다이얼로그
                        showCustomDialog("아이디와 비밀번호를 확인하세요.")
                    }
                }
                override fun onFailure(call: Call<MeausreProUser>, t: Throwable) {
                    Log.d("MeausreProLog Login Fail", t.toString())
                }
            })
        }
        // 테스트용 로그인 버튼
//        binding.btnTest.setOnClickListener {
//            val id = "test"
//            val pw = "test123"
//
//            val loginUser = MeausreProUser(null, id, pw, null, null, null, null, null)
//
//            MeausreProClient.retrofit.login(loginUser).enqueue(object : Callback<MeausreProUser> {
//                override fun onResponse(
//                    call: Call<MeausreProUser>,
//                    response: Response<MeausreProUser>
//                ) {
//                    if (response.isSuccessful) {
//                        Log.d("MeausreProLog Login", response.body().toString())
//                        val intent = Intent(this@MainActivity, MainActivity_MeausrePro::class.java)
//                        intent.putExtra("id", id)
//                        startActivity(intent)
//                    }
//                    else {
//                        // 커스텀 다이얼로그
//                        showCustomDialog("아이디와 비밀번호를 확인하세요.")
//                    }
//                }
//                override fun onFailure(call: Call<MeausreProUser>, t: Throwable) {
//                    Log.d("MeausreProLog Login Fail", t.toString())
//                }
//            })
//        }
    }
    // 커스텀 다이얼로그 함수
    private fun showCustomDialog(message: String) {
        val dialogView = LayoutInflater.from(this).inflate(R.layout.dialog_confirm, null) // XML 레이아웃 경로 맞춤
        val builder = AlertDialog.Builder(this)
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
            dialog.dismiss() // 확인 버튼 클릭 시 다이얼로그 닫기
            binding.edtPass.setText(null)
        }

        dialog.show()
    }
}