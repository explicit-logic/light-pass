class Responder implements Partial<ResponderInterface> {
  #id: number;
  #quizId: number;
  #userAgent: string;
  #identified = false;
  #email?: string;
  #name?: string;
  #theme: ThemeModeType;
  #timeZone: string;
  #group?: string;
  #answer?: object;

  constructor(params: {
    id: number;
    quizId: number;
    userAgent: string;
    timeZone: string;
    theme: ThemeModeType;
  }) {
    const { id, quizId, userAgent, timeZone, theme } = params;

    this.#id = id;
    this.#quizId = quizId;
    this.#userAgent = userAgent;
    this.#timeZone = timeZone;
    this.#theme = theme;
  }

  identify({
    email,
    name,
    group,
  }: {
    email: string;
    name?: string;
    group?: string;
  }) {
    this.#identified = true;
    this.#email = email;
    this.#name = name;
    this.#group = group;
  }

  setAnswer(answer: object) {
    this.#answer = answer;
  }

  get id() {
    return this.#id;
  }

  get quizId() {
    return this.#quizId;
  }

  get userAgent() {
    return this.#userAgent;
  }

  get email() {
    return this.#email;
  }

  get identified() {
    return this.#identified;
  }

  get name() {
    return this.#name;
  }

  get theme() {
    return this.#theme;
  }

  get timeZone() {
    return this.#timeZone;
  }

  get group() {
    return this.#group;
  }

  get answer() {
    return this.#answer;
  }
}

export default Responder;
