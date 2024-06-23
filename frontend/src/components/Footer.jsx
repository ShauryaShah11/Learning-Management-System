const Footer = () => {
  return (
      <footer className="bg-custom-black px-10 pt-10 mx-auto">
          {/* Footer content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex flex-col">
                  <div className="text-white mb-5 text-sm sm:text-base md:text-lg">About Us</div>
                  <div className="text-white mb-5 text-sm sm:text-base md:text-lg">Contact Us</div>
                  <div className="text-white mb-5 text-sm sm:text-base md:text-lg">FAQs</div>
                  <div className="text-white mb-5 text-sm sm:text-base md:text-lg">Terms of Service</div>
              </div>
              <div className="flex flex-col">
                  <div className="text-white mb-5 text-sm sm:text-base md:text-lg">Privacy Policy</div>
                  <div className="text-white mb-5 text-sm sm:text-base md:text-lg">Shipping Policy</div>
                  <div className="text-white mb-5 text-sm sm:text-base md:text-lg">Refund Policy</div>
                  <div className="text-white mb-5 text-sm sm:text-base md:text-lg">Cookie Policy</div>
              </div>
              <div className="flex flex-col">
                  <div className="text-white mb-5 text-sm sm:text-base md:text-lg">Careers</div>
                  <div className="text-white mb-5 text-sm sm:text-base md:text-lg">Press</div>
                  <div className="text-white mb-5 text-sm sm:text-base md:text-lg">Partnerships</div>
                  <div className="text-white mb-5 text-sm sm:text-base md:text-lg">Investors</div>
              </div>
          </div>
          <div className="text-white text-lg sm:text-xl md:text-2xl pb-5 mt-10">Knowledge Hive</div>
      </footer>
  );
};

export default Footer;
