function ProjectCreateModal(props) {
    const {geometryData, isOpen, closeModal} = props;
    return (
        <div className={`modal fade ${isOpen ? 'show d-block' : ''}`} id={'createProject'} tabIndex={'-1'}
             aria-labelledby={'cpModalLabel'}
             aria-hidden={!isOpen} style={{display: isOpen ? 'block' : 'none'}}>
            <div className={'modal-dialog modal-dialog-centered modal-dialog-scrollable'}>
                <div className={'modal-content'}>
                    <div className={'modal-header'}>
                        <span className={'fs-4 modal-title'} id={'cpModalLabel'}>
                            공사개요
                        </span>
                        <button type={'button'} className={'btn-close'} data-bs-dismiss={'modal'}
                                aria-label={'Close'} onClick={closeModal}/>
                    </div>
                    <div className={'modal-body'}>
                        <div className={'d-flex flex-column'}>
                            <div className={'d-flex align-items-center'}>
                                <span className={'text-danger'}>*</span>
                                <label htmlFor={'siteName'} className={'form-label'}>
                                    현장명
                                </label>
                            </div>
                            <input type={'text'} className={'form-control'} id={'siteName'}
                                   placeholder={'현장명을 입력하세요'}/>
                            <div className={'d-flex align-items-center mt-2'}>
                                <span className={'text-danger'}>*</span>
                                <label htmlFor={'address'} className={'form-label'}>
                                    주소
                                </label>
                            </div>
                            <input type={'text'} className={'form-control'} id={'address'}
                                   placeholder={'주소를 입력하세요'}/>
                            <div className={'row mt-2'}>
                                <div className={'col d-flex flex-column'}>
                                    <div className={'d-flex align-items-center mt-2'}>
                                        <span className={'text-danger'}>*</span>
                                        <label htmlFor={'startDate'} className={'form-label'}>
                                            시작일자
                                        </label>
                                    </div>
                                    <input type={'date'} className={'form-control'} id={'startDate'}
                                           placeholder={'시작일자를 입력하세요'}/>
                                </div>
                                <div className={'col d-flex flex-column'}>
                                    <div className={'d-flex align-items-center mt-2'}>
                                        <span className={'text-danger'}>*</span>
                                        <label htmlFor={'endDate'} className={'form-label'}>
                                            종료일자
                                        </label>
                                    </div>
                                    <input type={'date'} className={'form-control'} id={'endDate'}
                                           placeholder={'종료일자를 입력하세요'}/>
                                </div>
                            </div>
                            <div className={'row mt-2'}>
                                <div className={'col d-flex flex-column'}>
                                    <div className={'d-flex align-items-center mt-2'}>
                                        <span className={'text-danger'}>*</span>
                                        <label htmlFor={'contractor'} className={'form-label'}>
                                            시공사
                                        </label>
                                    </div>
                                    <input type={'text'} className={'form-control'} id={'contractor'}
                                           placeholder={'시공사를 입력하세요'}/>
                                </div>
                                <div className={'col d-flex flex-column'}>
                                    <div className={'d-flex align-items-center mt-2'}>
                                        <span className={'text-danger'}>*</span>
                                        <label htmlFor={'measurer'} className={'form-label'}>
                                            계측사
                                        </label>
                                    </div>
                                    <input type={'text'} className={'form-control'} id={'measurer'}
                                           placeholder={'계측사를 입력하세요'}/>
                                </div>
                            </div>
                            <div className={'d-flex align-items-center mt-2'}>
                                <span className={'text-danger'}>*</span>
                                <label className={'form-label'}>
                                    종료여부
                                </label>
                            </div>
                            <div className={'d-flex gap-2'}>
                                <div className={'form-check form-check-inline'}>
                                    <input className={'form-check-input'} type={'radio'} name={'status'}
                                           id={'ongoing'}
                                           value={'ongoing'} checked/>
                                    <label className={'form-check-label'} htmlFor={'ongoing'}>진행</label>
                                </div>
                                <div className={'form-check form-check-inline'}>
                                    <input className={'form-check-input'} type={'radio'} name={'status'}
                                           id={'finished'}
                                           value={'finished'}/>
                                    <label className={'form-check-label'} htmlFor={'finished'}>종료</label>
                                </div>
                            </div>
                            <div className={'row mt-2'}>
                                <div className={'col d-flex flex-column'}>
                                    <div className={'d-flex align-items-center mt-2'}>
                                        <span className={'text-danger'}>*</span>
                                        <label htmlFor={'geometryInfo'} className={'form-label'}>
                                            지오매트리정보
                                        </label>
                                    </div>
                                    <input type={'text'} className={'form-control'} id={'geometryInfo'}
                                           placeholder={'지오매트리정보를 입력하세요'} value={geometryData} readOnly/>
                                </div>
                                <div className={'col d-flex flex-column'}>
                                    <label htmlFor={'workGroup'} className={'form-label'}>
                                        작업그룹
                                    </label>
                                    <select className={'form-select'} id={'workGroup'}>
                                        <option selected>선택하세요</option>
                                        <option value={'group1'}>그룹 1</option>
                                        <option value={'group2'}>그룹 2</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className={'modal-footer'}>
                            <button type={'button'} className={'btn btn-outline-dark opacity-50'}
                                    data-bs-dismiss={'modal'} onClick={closeModal}>
                                Close
                            </button>
                            <button type={'button'} className={'btn btn-success opacity-50'}>
                                프로젝트 생성
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default ProjectCreateModal;
