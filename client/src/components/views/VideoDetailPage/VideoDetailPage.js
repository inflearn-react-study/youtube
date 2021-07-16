import React, {useEffect, useState} from 'react';
import {Row, Col, List, Avatar} from "antd";
import axios from "axios";

function VideoDetailPage(props) {
    const videoId = props.match.params.videoId
    const variable = {videoId: videoId};
    const [videoDetail, setVideoDetail] = useState([]);

    useEffect(() => {
        axios.post('/api/video/getVideoDetail', variable)
            .then(res => {
                if (res.data.success) {
                    console.log(res.data);
                    setVideoDetail(res.data.videoDetail);
                } else {
                    alert('비디오 정보를 가져오는데 실패했습니다.');
                }
            });
    }, []);

    if (videoDetail.writer) {
        return (
            <Row gutter={[16, 16]}>
                <Col lg={18} xs={24}>

                    <div style={{width: '100%', padding: '3rem 4rem'}}>
                        <video style={{width: '100%'}}
                               src={`http://localhost:5000/${videoDetail.filePath}`}
                               // controls
                        />
                        <List.Item
                            actions
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={videoDetail.writer.image}/>}
                                title={videoDetail.writer.name}
                                description={videoDetail.description}
                            />

                        </List.Item>
                        {/* 댓글 부분  */}

                    </div>
                </Col>

                <Col lg={6} xs={24}>
                    Side Videos
                </Col>

            </Row>
        );
    } else {
        return (
            <div>Loading...</div>
        )
    }

}

export default VideoDetailPage;