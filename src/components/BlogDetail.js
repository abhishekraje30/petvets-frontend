import React from 'react';
import { useSearchParams } from 'react-router-dom';
import axiosClient from '../api-client';

const BlogDetail = (props) => {
  const [params] = useSearchParams();
  const [blogData, setBlogData] = React.useState({ __html: '' });
  const link = params.get('link');

  React.useEffect(() => {
    const getBlogs = async () => {
      const blogDetail = await axiosClient.get(
        'api/blogs/blogDetail?link=' + link
      );
      setBlogData({ __html: blogDetail.data[0] });
    };
    getBlogs();
  }, [link]);

  return <div dangerouslySetInnerHTML={blogData} />;
};

export default BlogDetail;
