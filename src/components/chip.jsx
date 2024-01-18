import React, { useState, useRef } from 'react';
import { HiX } from 'react-icons/hi';
import profiles from './data';
import "./chip.css"
import img from "./assets/user.png"

const Chips = () => {
    // State for search term, selected emails, selected item index, and already selected visibility
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEmails, setSelectedEmails] = useState([]);
    const [selectedItemIndex, setSelectedItemIndex] = useState(-1);
    const dropdownRef = useRef(null); // Ref for dropdown container
    const [isAlreadySelectedVisible, setIsAlreadySelectedVisible] = useState(false);

    // Function to handle email selection
    const handleEmailSelect = (profile) => {
        // Check if the profile is already selected
        const isAlreadySelected = selectedEmails.some((selected) => selected.id === profile.id);

        if (!isAlreadySelected) {
            // If not already selected, add to the selected emails
            setSelectedEmails([...selectedEmails, profile]);
            setSearchTerm('');
            setSelectedItemIndex(-1);
        } else {
            // If already selected, show the message and hide it after 3 seconds
            setIsAlreadySelectedVisible(true);
            setTimeout(() => {
                setIsAlreadySelectedVisible(false);
            }, 1500);
        }
    };

    // Function to handle email removal
    const handleEmailRemove = (index) => {
        const newEmails = [...selectedEmails];
        newEmails.splice(index, 1);
        setSelectedEmails(newEmails);
    };

    // Function to handle keydown events for keyboard navigation
    const handleKeyDown = (e) => {
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedItemIndex((prevIndex) => Math.min(prevIndex + 1, filteredProfiles.length - 1));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedItemIndex((prevIndex) => Math.max(prevIndex - 1, -1));
                break;
            case 'Enter':
                // If Enter is pressed, select the profile if an item is highlighted
                if (selectedItemIndex !== -1) {
                    handleEmailSelect(filteredProfiles[selectedItemIndex]);
                }
                break;
            default:
                break;
        }

        // Scroll the container to ensure the selected item is visible
        if (selectedItemIndex !== -1 && dropdownRef.current) {
            const selectedItem = dropdownRef.current.querySelector(`#profile-${selectedItemIndex}`);
            if (selectedItem) {
                selectedItem.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                });
            }
        }
    };

    // Filtered profiles based on the search term
    const filteredProfiles = profiles.filter(
        (profile) =>
            profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            profile.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className='custom-container'>
            <div className='head'><img src={img} className='img' />
                <h1 className='custom-heading'> Users Selector</h1></div>
            {/* Show already selected message if visible */}
            {isAlreadySelectedVisible === true ? <h1 className='custom-error-message'>User Already Selected!</h1> : ''}
            <div className='custom-flex-container'>
                <div className="custom-input-container">
                    {/* Display selected emails */}
                    {selectedEmails.map((selected, index) => (
                        <div key={index} className="custom-selected-email">
                            <img
                                src={selected.image}
                                alt="Profile"
                                className="custom-profile-image"
                            />
                            <span>{selected.name}</span>
                            <HiX
                                className="custom-remove-icon"
                                onClick={() => handleEmailRemove(index)}
                            />
                        </div>
                    ))}
                    <div className="custom-relative-container">
                        {/* Input for adding new users */}
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Add new user..."
                            className="custom-input"
                        />
                        {/* Display dropdown with filtered profiles */}
                        {searchTerm && (
                            <div
                                ref={dropdownRef}
                                className="custom-dropdown"
                            >
                                {filteredProfiles.map((profile, index) => (
                                    <div
                                        id={`profile-${index}`}
                                        key={profile.id}
                                        onClick={() => handleEmailSelect(profile)}
                                        className={`custom-dropdown-item ${index === selectedItemIndex ? 'custom-dropdown-item-selected' : ''}`}
                                        onMouseEnter={() => setSelectedItemIndex(index)}
                                    >
                                        <img
                                            src={profile.image}
                                            alt="Profile"
                                            className="custom-dropdown-profile-image"
                                        />
                                        {/* Display name and email */}
                                        <h1>{profile.name}</h1>
                                        <h1 className='custom-dropdown-email'>{`<${profile.email}>`}</h1>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chips;
