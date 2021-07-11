import React, {useState} from 'react';
import axios from 'axios';
import Title from "antd/es/typography/Title";
import {Button, Form, Input} from "antd";
import TextArea from "antd/es/input/TextArea";
import Dropzone from "react-dropzone";
import Icon from "@ant-design/icons";

const privateOptions = [
    {value: 0, label: "Private"},
    {value: 1, label: "Public"},
]

const categoryOptions = [
    {value: 0, label: "Film & Animation"},
    {value: 1, label: "Auto & Vehicles"},
    {value: 2, label: "Music"},
    {value: 3, label: "Pets & Animals"},
]


function VideoUploadPage(props) {

    const [videoTitle, setVideoTitle] = useState("");
    const [description, setDescription] = useState("");
    const [privateStatus, setPrivate] = useState(0);
    const [category, setCategory] = useState("Film & Animation");
    const [filePath, setFilePath] = useState("");
    const [thumbnailPath, setThumbnailPath] = useState("");
    const [duration, setDuration] = useState("");


    const onTitleChange = (e) => {
        setVideoTitle(e.currentTarget.value);
    }

    const onDescriptionChange = (e) => {
        setDescription(e.currentTarget.value);
    }

    const onPrivateChange = (e) => {
        setPrivate(e.currentTarget.value);
    }

    const onCategoryChange = (e) => {
        setCategory(e.currentTarget.value);
    }

    const onDrop = (files) => {
        let formData = new FormData();
        const config = {
            header: {'content-type': 'multipart/form-data'}
        }
        formData.append("file", files[0]);
        axios.post('/api/video/uploadFiles', formData, config)
            .then(res => {
                if (res.data.success) {
                    // console.log(res.fileName);
                    let variable = {
                        url: res.data.url,
                        fileName: res.data.fileName
                    }
                    setFilePath(res.data.url);
                    axios.post('/api/video/thumbnail', variable)
                        .then(res => {
                            if (res.data.success) {
                                setDuration(res.data.fileDuration);
                                console.log('thumbnails_path', res.data.url);
                                setThumbnailPath(res.data.url);
                            } else {
                                alert('썸네일 생성에 실패했습니다.')
                            }
                        });

                } else {
                    alert('비디오 업로드를 실패했습니다.')
                }
            });
    }

    return (
        <div style={{maxWidth: '700px', margin: '2rem auto'}}>
            <div style={{textAlign: 'center', marginBottom: '2rem'}}>
                <Title level={2}>Upload Video</Title>
            </div>
            <Form onSubmit>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    {/*Drop zone*/}
                    <Dropzone
                        onDrop={onDrop}
                        multiple={false}
                        /*maxSize={2097152}*/>
                        {({getRootProps, getInputProps}) => (
                            <div style={{
                                width: '300px', height: '240px', border: '1px solid lightgray', display: 'flex',
                                alignItems: 'center', justifyContent: 'center'
                            }} {...getRootProps()}>
                                <input {...getInputProps()}/>
                                <Icon type="plus" style={{fontSize: '3rem'}}/>

                            </div>
                        )}
                    </Dropzone>
                    {/* Thumbnail   */}

                    {thumbnailPath &&
                    <div>
                        <img src={`http://localhost:5000/${thumbnailPath}`} alt="thumbnail"/>
                    </div>
                    }

                </div>
                <br/>
                <br/>
                <label>Title</label>
                <Input
                    onChange={onTitleChange}
                    value={videoTitle}
                />
                <br/>
                <br/>
                <label>description</label>
                <TextArea
                    onChange={onDescriptionChange}
                    value={description}
                />
                <br/>
                <br/>

                <select onChange={onPrivateChange}>
                    {privateOptions.map((item, index) => (
                        <option key={index} value={item.value}> {item.label}</option>
                    ))}
                </select>
                <br/>
                <br/>

                <select onChange={onCategoryChange}>
                    {categoryOptions.map((item, index) => (
                        <option key={index} value={item.value}> {item.label}</option>
                    ))}
                </select>
                <br/>
                <br/>

                <Button type="primary" size="large" onClick>
                    Submit
                </Button>
            </Form>
        </div>
    );
}

export default VideoUploadPage;