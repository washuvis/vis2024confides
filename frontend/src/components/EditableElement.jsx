import sanitizeHtml from "sanitize-html"
import ContentEditable from 'react-contenteditable';
import React from "react";


const EditableElement = () => {
	const [content, setContent] = React.useState("")

	const onContentChange = React.useCallback(evt => {
		const sanitizeConf = {
			allowedTags: ["b", "i", "a", "p"],
			allowedAttributes: { a: ["href"] }
		};

		setContent(sanitizeHtml(evt.currentTarget.innerHTML, sanitizeConf))
	}, [])

	return (
		<ContentEditable
			onChange={onContentChange}
			onBlur={onContentChange}
			html={content} />
	)
}

export default EditableElement;