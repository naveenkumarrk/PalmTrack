import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import FeaturesPage from './FeaturesPage';

const Home = () => {
  return (
    <div className="">
    <section class="transparent text-black">
    <div class="py-[15vh] mb-[10vh] px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
        <a href="#" class="inline-flex justify-between items-center py-1 px-1 pr-4 mb-7 text-sm text-gray-700 bg-gray-100 rounded-full dark:bg-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700" role="alert">
            <span class="text-xs bg-primary-600 rounded-full px-4 py-1.5 mr-3">New</span> <span class="text-sm font-medium">PalmTrack all in one!</span> 
            <svg class="ml-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>
        </a>
        <h1 class="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl "> Track Your Neera Production Process Efficiently</h1>
        <p class="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 ">Palm Track is designed to help you accurately monitor and optimize your
          Neera production at every stage. With real-time waste tracking, accurate
          metrics, and insightful analytics, Palm Track ensures maximum efficiency.</p>
        <div class="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
            
            <p class="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-gray-900 rounded-lg border border-gray-300 bg-gray-900 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800">
                Try our Product !
            </p>  
        </div>

    </div>
</section>
<FeaturesPage/>

</div>
  )
}

export default Home