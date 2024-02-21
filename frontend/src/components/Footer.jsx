const Footer = () => {
    return (
      <footer className='bg-custom-black px-10 pt-10 mx-auto'>
        {/* Footer content */}
        <div className='grid grid-cols-3'>
          <div className='flex flex-col'>
            <div className='text-white mb-5'>About Us</div>
            <div className='text-white mb-5'>Contact Us</div>
            <div className='text-white mb-5'>FAQs</div>
            <div className='text-white mb-5'>Terms of Service</div>
          </div>
          <div className='flex flex-col'>
            <div className='text-white mb-5'>Privacy Policy</div>
            <div className='text-white mb-5'>Shipping Policy</div>
            <div className='text-white mb-5'>Refund Policy</div>
            <div className='text-white mb-5'>Cookie Policy</div>
          </div>
          <div className='flex flex-col'>
            <div className='text-white mb-5'>Careers</div>
            <div className='text-white mb-5'>Press</div>
            <div className='text-white mb-5'>Partnerships</div>
            <div className='text-white mb-5'>Investors</div>
          </div>
        </div>
        <div className='text-white text-3xl pb-5 mt-10'>Knowledge Hive</div>
      </footer>
    );
  };
  
  export default Footer;
  