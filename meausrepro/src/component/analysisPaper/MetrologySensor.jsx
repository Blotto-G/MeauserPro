function MetrologySensor() {
    return (
        <div  style={{width: '25%',}}>
            <div className={"container-box"}>
                <div className={"d-flex"}>
                    <div>
                        <img src="http://www.geoms.co.kr/file_api/view/4/0/0/29/f.dr" alt=""
                            style={{width: '50%'}}
                        />
                        <img src="http://www.geoms.co.kr/file_api/view/4/0/0/28/f.dr" alt=""
                            style={{width: '50%'}}
                        />
                    </div>
                </div>
                <div style={{marginTop: '10px'}}>
                    <table className={"table table-bordered"} style={{borderCollapse: 'collapse'}}>
                        <tr>
                            <th className={"custom-th"}>벽체공</th>
                            <td colSpan={"2"} style={{border: '1px solid #aaa'}}>흙막이판</td>
                        </tr>
                        <tr>
                            <th className={"custom-th"}>지지공</th>
                            <td colSpan={"2"} style={{border: '1px solid #aaa'}}>앵커유형</td>
                        </tr>
                        <tr>
                            <th rowSpan={"2"} className={"custom-th"}>주요관리대상물</th>
                            <th className={"custom-th"} style={{ borderLeft: '1px solid #aaa' }}>배면</th>
                            <td style={{border: '1px solid #aaa'}}>RC용벽</td>
                        </tr>
                        <tr>
                            <th className={"custom-th"} style={{ borderLeft: '1px solid #aaa' }}>지중</th>
                            <td style={{border: '1px solid #aaa'}}>상수관, 오수관</td>
                        </tr>
                    </table>
                </div>
                <div>
                    <h5>계측센서정보</h5>
                    <table className={"table table-bordered"} style={{borderCollapse: 'collapse'}}>
                        <thead>
                        <tr>
                            <th className={"custom-th"}>센서</th>
                            <th className={"custom-th"}>센서명</th>
                            <th className={"custom-th"}>제품명</th>
                            <th className={"custom-th"}>Serial No.</th>
                            <th className={"custom-th"}>Logger명</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th className={"custom-th"}></th>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <th className={"custom-th"}></th>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <th className={"custom-th"}></th>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <th className={"custom-th"}></th>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <th className={"custom-th"}></th>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <th className={"custom-th"}></th>
                            <td colSpan={"3"}></td>
                            <td></td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default MetrologySensor;