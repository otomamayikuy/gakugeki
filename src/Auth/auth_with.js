import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle, faTwitter } from '@fortawesome/free-brands-svg-icons'
import Button from './button'

export default function AuthWith({str}) {

    return (
        <div className="py-2">
            <Button className="border-gray-700 text-gray-700 w-full focus:outline-none focus:shadow-outline">
                <FontAwesomeIcon icon={faGoogle} className="mr-2" />Googleで{str}
            </Button>
            <Button className="border-gray-700 text-gray-700 w-full focus:outline-none focus:shadow-outline">
                <FontAwesomeIcon icon={faTwitter} className="mr-2" />Twitterで{str}
            </Button>
        </div>
    );
}