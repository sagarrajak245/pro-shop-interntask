import { Github, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-secondary dark:bg-primary mt-12">
            <div className="container mx-auto px-6 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="text-center md:text-left mb-6 md:mb-0">
                        <h2 className="text-2xl font-bold text-yellow-500">SHOPCLUES</h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Your one-stop shop for endless deals.</p>
                    </div>
                    <div className="flex space-x-4">
                        <a href="#" className="text-gray-600 hover:text-yellow-500 dark:text-gray-400 dark:hover:text-yellow-400 transition-colors">
                            <Github size={24} />
                        </a>
                        <a href="#" className="text-gray-600 hover:text-yellow-500 dark:text-gray-400 dark:hover:text-yellow-400 transition-colors">
                            <Twitter size={24} />
                        </a>
                        <a href="#" className="text-gray-600 hover:text-yellow-500 dark:text-gray-400 dark:hover:text-yellow-400 transition-colors">
                            <Instagram size={24} />
                        </a>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-300 dark:border-gray-700 pt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    <p>&copy; 2024 SHOPCLUES Inc. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
