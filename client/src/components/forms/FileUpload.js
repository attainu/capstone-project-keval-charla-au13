import React from "react";
import Resizer from "react-image-file-resizer";
import axios from "axios";
import { useSelector } from "react-redux";
import { Avatar, Badge } from "antd";

const FileUpload = ({ values, setValues, setLoading }) => {
  const { user } = useSelector((state) => ({ ...state }));

  const fileUploadAndResize = (e) => {
    let files = e.target.files;
    let allUploadedFiles = values.images;

    if (files) {
      setLoading(true);

      for (let i = 0; i < files.length; i++) {
        Resizer.imageFileResizer(
          files[i],
          720,
          720,
          "JPEG",
          100,
          0,
          (uri) => {
            axios
              .post(
                `${process.env.REACT_APP_API}/uploadimages`,
                { image: uri },
                {
                  headers: {
                    authtoken: user ? user.token : "",
                  },
                }
              )
              .then((res) => {
                console.log("image upload res data", res);

                setLoading(false);

                allUploadedFiles.push(res.data);

                setValues({ ...values, images: allUploadedFiles });
              })
              .catch((err) => {
                console.log("cloudinery upload err", err);
              });
          },
          "base64"
        );
      }
    }
  };

  const handleImageRemove = (public_id) => {
    setLoading(true);
    // console.log("remove image", public_id);
    axios.post(
      `${process.env.REACT_APP_API}/removeimage`,
      { public_id },
      {
        headers: {
          authtoken: user ? user.token : "",
        },
      }
    ).then(res => {
      setLoading(false);
      const { images } = values;
      let filteredImages = images.filter(item => {
        return item.public_id !== public_id
      });

      setValues({ ...values, images: filteredImages });

    }).catch(err => {
      console.log(err);
      setLoading(false);
    })

  }

  return (
    <>
      <div className="row">
        {values.images &&
          values.images.map((image) => (
            <div className="col-md-1 ms-3" key={image.public_id}>
              <span className="avatar-item">
                <Badge
                  count="X"
                  onClick={() => handleImageRemove(image.public_id)}
                  style={{ cursor: "pointer" }}
                >
                  <Avatar
                    alt={image.url}
                    src={image.url}
                    size={100}
                    shape="square"
                  />
                </Badge>
              </span>
            </div>
          ))}
      </div>

      <br />

      <div className="row">
        <label style={{ width: "15%" }} className="btn btn-primary">
          Choose File
          <input
            type="file"
            multiple
            hidden
            accept="images/*"
            onChange={fileUploadAndResize}
          />
        </label>
      </div>
    </>
  );
};

export default FileUpload;
