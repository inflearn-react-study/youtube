import React, {useEffect, useState} from 'react'

import {Avatar, Card, Col, Row, Typography} from "antd";

import axios from "axios";
import moment from "moment";


const {Title} = Typography;
const {Meta} = Card;

function LandingPage() {

    const [Video, setVideos] = useState([]);


    useEffect(() => {
        axios.get("/api/video/getVideos")
            .then(res => {
                if (res.data.success) {
                    console.log(res.data.videos);
                    setVideos(res.data.videos);
                } else {
                    alert('비디오 가져오기를 실패 했습니다.');
                }
            })
    }, []);
    console.log('videos', Video)

    const renderCards = Video.map((video, index) => {
        console.log('map', video);
        let minutes = Math.floor(video.duration / 60);
        let seconds = Math.floor(video.duration - minutes * 60);

        return <Col lg={6} md={8} xs={24}>
            <a href={`/video/post/${video._id}`}>
                <div style={{position: 'relative'}}>
                    <img style={{width: '100%'}} src={`http://localhost:5000/${video.thumbnail}`}
                         alt="thumbnail"/>
                    <div className="duration">
                        <span> {minutes}: {seconds}</span>

                    </div>

                </div>
            </a>
            <br/>
            <Meta
                avatar={
                    <Avatar src={video.writer.image}/>
                }
                title={video.title}
                description=""
            />
            <span>{video.writer.name}</span><br/>
            <span style={{marginLeft: '3rem'}}>{video.views} views</span> - <span>{moment(video.createdAt).format('YYYY-MM-DD')}</span>


        </Col>

    })

    return (
        <div style={{width: '85%', margin: '3rem auto'}}>
            <Title level={2}> Recommended</Title>
            <hr/>
            <Row gutter={[32, 16]}>
                {renderCards}

            </Row>
        </div>
    )
}

export default LandingPage
