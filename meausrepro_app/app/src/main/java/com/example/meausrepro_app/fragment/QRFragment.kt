package com.example.meausrepro_app.fragment

import android.Manifest
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.hardware.camera2.CameraManager
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.core.content.ContextCompat.startActivity
import androidx.fragment.app.Fragment
import com.example.meausrepro_android.R
import com.example.meausrepro_android.databinding.FragmentQRBinding
import com.example.meausrepro_app.MainActivity
import com.example.meausrepro_app.db.MeausreProClient
import com.journeyapps.barcodescanner.DecoratedBarcodeView
import retrofit2.Call
import retrofit2.Response

@androidx.camera.core.ExperimentalGetImage
class QRFragment : Fragment(), DecoratedBarcodeView.TorchListener {
    private var id: String? = null
    lateinit var binding: FragmentQRBinding

    private val CAMERA_REQUEST_CODE = 100
    private lateinit var cameraManager: CameraManager
    private var isFlashOn: Boolean = false // 플래시 상태 변수

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
        binding = FragmentQRBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        // 카메라 권한 확인
        if (requireContext().checkSelfPermission(Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
            requestPermissions(arrayOf(Manifest.permission.CAMERA), CAMERA_REQUEST_CODE)
        } else {
            startQRScanner()
        }

        cameraManager = requireContext().getSystemService(Context.CAMERA_SERVICE) as CameraManager

        // QR 스캐너에 TorchListener 설정
        binding.qrScanner.setTorchListener(this)

        // 플래시 버튼 클릭 시 플래시 토글
        binding.btnFlash.setOnClickListener {
            toggleFlash()
        }

        // 로그아웃 버튼 클릭 시 다이얼로그 표시
        binding.btnLogout.setOnClickListener {
            showCustomDialog("로그아웃 하시겠습니까?", "logout")
        }
    }

    private fun toggleFlash() {
        try {
            isFlashOn = !isFlashOn
            if (isFlashOn) {
                binding.qrScanner.setTorchOn()  // QR 스캐너의 플래시 켜기
            } else {
                binding.qrScanner.setTorchOff() // QR 스캐너의 플래시 끄기
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    override fun onTorchOn() {
        isFlashOn = true
        binding.btnFlash.text = "플래시 끄기"
    }

    override fun onTorchOff() {
        isFlashOn = false
        binding.btnFlash.text = "플래시 켜기"
    }

    // 권한 요청 결과 처리
    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == CAMERA_REQUEST_CODE) {
            if (grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                // 권한이 허용되면 QR 스캐너 시작
                startQRScanner()
            } else {
                // 권한이 거부된 경우 메시지 표시
                Toast.makeText(context, "카메라 권한이 필요합니다.", Toast.LENGTH_SHORT).show()
            }
        }
    }
    override fun onResume() {
        super.onResume()
        binding.qrScanner.resume()
    }

    override fun onPause() {
        super.onPause()
        binding.qrScanner.pause()
    }
    companion object {
        @JvmStatic
        fun newInstance(id:String) =
            QRFragment().apply {
                arguments = Bundle().apply {
                    putString("id", id)
                }
            }
    }

    // QR 스캐너 시작
    private fun startQRScanner() {
        binding.qrScanner.apply {
            setStatusText("QR코드를 사각형 안에 비춰주세요.")
            decodeContinuous { result ->
                Log.d("QRTag", result.text)
                val instrIdx = result.text.toInt()
                fetchInstrumentInfo(instrIdx)
            }
        }
    }

    // 읽은 값 조회
    private fun fetchInstrumentInfo(instrIdx: Int) {
        MeausreProClient.retrofit.accessInstrument(instrIdx, id!!).enqueue(object:retrofit2.Callback<Boolean>{
            override fun onResponse(call: Call<Boolean>, response: Response<Boolean>) {
                if (response.isSuccessful) {
                    val result = response.body()

                    if (result == true) {
                        // 계측기 값 입력 프래그 먼트 전환
                        val insFragment = InstrumentFragment.newInstance(instrIdx, id.toString())
                        val fragmentManager = requireActivity().supportFragmentManager
                        val fragmentTransaction = fragmentManager.beginTransaction()

                        fragmentTransaction.replace(R.id.mainContainer, insFragment)
                        fragmentTransaction.addToBackStack(null)
                        fragmentTransaction.commit()

                    } else {
                        Log.d("QRTag Response", response.body().toString())
                    }
                }
            }

            override fun onFailure(call: Call<Boolean>, t: Throwable) {
                Log.d("QRTag", t.toString())
            }
        })
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
        val btnConfirm = dialogView.findViewById<Button>(R.id.btnConfirm)

        btnCancel.setOnClickListener {
            dialog.dismiss() // 취소 버튼 클릭 시 다이얼로그 닫기
        }

        btnConfirm.setOnClickListener {
            if (stats=="logout") {
                // 로그아웃 처리 (MainActivity로 이동)
                val intent = Intent(binding.root.context, MainActivity::class.java)
                intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                startActivity(intent)
                dialog.dismiss() // 다이얼로그 닫기
            } else {
                dialog.dismiss()
            }
        }

        dialog.show()
    }
}