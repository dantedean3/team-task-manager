function AuthForm({
  isLogin,
  setIsLogin,
  fullName,
  setFullName,
  email,
  password,
  setEmail,
  setPassword,
  handleSignUp,
  handleSignIn,
}) {
  return (
    <div className="mx-auto max-w-md rounded-[28px] border border-white/10 bg-slate-900/75 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl">
      <div className="mb-6 flex rounded-2xl border border-white/10 bg-slate-950/70 p-1">
        <button
          onClick={() => setIsLogin(true)}
          className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition ${
            isLogin ? 'bg-cyan-400 text-slate-950' : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          Log In
        </button>

        <button
          onClick={() => setIsLogin(false)}
          className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition ${
            !isLogin ? 'bg-cyan-400 text-slate-950' : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          Sign Up
        </button>
      </div>

      <h2 className="mb-2 text-2xl font-semibold text-white">
        {isLogin ? 'Welcome back' : 'Create your account'}
      </h2>

      <p className="mb-6 text-sm text-slate-400">
        {isLogin
          ? 'Log in to manage your tasks.'
          : 'Sign up to create and track your own tasks.'}
      </p>

      <div className="space-y-4">
        {!isLogin && (
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Your name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
            />
          </div>
        )}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Email
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
          />
        </div>

        <div className="pt-2">
          {isLogin ? (
            <button
              onClick={handleSignIn}
              className="w-full rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Log In
            </button>
          ) : (
            <button
              onClick={handleSignUp}
              className="w-full rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Sign Up
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default AuthForm