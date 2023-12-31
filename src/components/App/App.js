import Component from '../../core/Component';
import Comments from '../Comments';
import { html } from '../../helper';
import data from '../../../data.json';
import CommentForm from '../CommentForm/CommentForm';
import './App.css';
import DeleteModal from '../DeleteModal/DeleteModal';

export default class App extends Component {
	setup() {
		this.state = {
			currentUser: data.currentUser,
			comments: data.comments,
			id: 6,
			currentEditingCommentId: null,
		};
	}

	template() {
		return html`
			<div class="app">
				<div class="comments-wrapper"></div>
				<div class="comments-form-wrapper"></div>
				<div class="delete-modal-wrapper"></div>
			</div>
		`;
	}

	mounted() {
		const $commentsWrapper = document.querySelector('.comments-wrapper');
		const $commentsFormWrapper = document.querySelector('.comments-form-wrapper');

		new Comments($commentsWrapper, {
			comments: this.state.comments,
			username: this.state.currentUser.username,
			showModal: this.showModal.bind(this),
			currentEditingCommentId: this.state.currentEditingCommentId,
			setEditingTarget: this.setEditingTarget.bind(this),
			editComment: this.editComment.bind(this),
		});
		new CommentForm($commentsFormWrapper, {
			currentUser: this.state.currentUser,
			addComment: this.addComment.bind(this),
		});
	}

	addComment(newComment) {
		this.setState({
			comments: [
				...this.state.comments,
				{
					id: this.state.id++,
					content: newComment,
					createdAt: 'now',
					score: 0,
					user: this.state.currentUser,
					replies: [],
				},
			],
		});
	}

	showModal(id) {
		const $deleteModalWrapper = document.querySelector('.delete-modal-wrapper');
		new DeleteModal($deleteModalWrapper, {
			closeModal: this.closeModal.bind(this),
			deleteComment: this.deleteComment.bind(this),
			commentId: id,
		});

		this.bodyOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
	}

	closeModal() {
		const $deleteModalWrapper = document.querySelector('.delete-modal-wrapper');
		$deleteModalWrapper.innerHTML = '';

		document.body.style.overflow = this.bodyOverflow;
	}

	deleteComment(id) {
		const filteredComments = this.state.comments.filter((comment) => comment.id !== id);
		this.setState({ comments: filteredComments });
		this.closeModal();
	}

	setEditingTarget(id) {
		this.setState({ currentEditingCommentId: id });
	}

	editComment(id, content) {
		this.setState({
			comments: this.state.comments.map((comment) =>
				comment.id === id
					? {
							...comment,
							content,
					  }
					: comment
			),
		});
	}
}
