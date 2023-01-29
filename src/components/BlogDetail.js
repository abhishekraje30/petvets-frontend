import React from 'react';
import { useSearchParams } from 'react-router-dom';
import axiosClient from '../api-client';
import { Copyright } from '../MuiComponents/Copyright';
const BlogDetail = (props) => {
  const [params] = useSearchParams();
  const [blogData, setBlogData] = React.useState({ __html: '' });
  const id = params.get('id');

  React.useEffect(() => {
    const getBlog = async () => {
      await axiosClient.get('api/blogs/allBlogs/' + id).then(async (detail) => {
        await axiosClient
          .get('api/blogs/blogDetail?link=' + detail.data.link)
          .then((blogDetail) => {
            setBlogData({ __html: blogDetail.data[0] });
          });
      });
    };
    getBlog();
  }, [id]);

  return (
    <>
      <div dangerouslySetInnerHTML={blogData} />
      <Copyright />
    </>
  );
};

export default BlogDetail;
